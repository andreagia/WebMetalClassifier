package org.cirmmp.webmetalclassifier.controller;


import org.cirmmp.webmetalclassifier.message.ResponseMessage;
import org.cirmmp.webmetalclassifier.model.*;
import org.cirmmp.webmetalclassifier.service.file.FilesStorageService;
import org.cirmmp.webmetalclassifier.service.run.RunCommandClassifier;
import org.cirmmp.webmetalclassifier.service.run.RunCommandLocal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Controller
public class RunController {
    private static final Logger LOGGER = LoggerFactory.getLogger(RunController.class);
    private final ExecutorService executor =  Executors.newFixedThreadPool(10);
    @Autowired
    FilesStorageService storageService;
    @Autowired
    RunCommandLocal runCommandLocal;

    @Autowired
    RunCommandClassifier commandClassifier;

    @CrossOrigin
    @PostMapping("/run")
    public ResponseEntity runNaccess(@RequestBody PostRun postRun)  throws Exception {
        String sessid = postRun.getDirtmp();

        Job job = new Job();
        String message = "Test RUN ";
        Path root = storageService.getRoot();
        Path sesspath = root.resolve(Paths.get(sessid));
        job.setDirectory(sesspath.toString());
        job.setPdb(postRun.getPdb());
        postRun.getPdb().forEach(System.out::println);

       OutRunCommnad outRunCommnad = runCommandLocal.runjob(job);
        LOGGER.info(root.toString());
        //return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(outRunCommnad));
        return ResponseEntity.ok(outRunCommnad);
    }
    @CrossOrigin
    @PostMapping("/submit")
    public ResponseEntity submit(@RequestBody Submitjson submitjson)  throws Exception {
        LOGGER.info(submitjson.toString());
        List<Submitjsonsingle> tocsv = new ArrayList<>();
        for (int i = 0; i < submitjson.getName().size(); i++) {
            Submitjsonsingle is = new Submitjsonsingle();
            is.setId( String.valueOf(i + 1));
            is.setName(submitjson.getName().get(i));
            is.setAccsolrel(submitjson.getAccsolrel().get(i));
            is.setAccSolAbs(submitjson.getAccSolAbs().get(i));
            is.setSecstru(submitjson.getSecstru().get(i));
            is.setFasta(submitjson.getFasta().get(i));
            is.setBindigpar(submitjson.getBindigpar().get(i));
            tocsv.add(is);
        }
        Job job = new Job();
        String message = "Test RUN ";
        Path root = storageService.getRoot();
        Path sesspath = root.resolve(Paths.get("MBSDL"));
        job.setDirectory(sesspath.toString());
        job.setSubmitjsonsingles(tocsv);
        OutRunCommnad outRunCommnad = commandClassifier.runclassifier(job);

        LOGGER.info(tocsv.toString());
        return ResponseEntity.ok(outRunCommnad);
    }

}
